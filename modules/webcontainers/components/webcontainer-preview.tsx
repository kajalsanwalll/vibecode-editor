
"use client";

import React, { useEffect, useState, useRef } from "react";

import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  serverUrl: string;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean;
}

const WebContainerPreview = ({
  templateData,
  error,
  instance,
  isLoading,
  forceResetup = false,
}: WebContainerPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [loadingState, setLoadingState] = useState({
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
    ready: false,
  });

  const [TerminalComponent, setTerminalComponent] =
    useState<React.ForwardRefExoticComponent<any> | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);

  const terminalRef = useRef<any>(null);

  // Helper: Write messages to terminal
  const writeTerminal = (message: string) => {
    terminalRef.current?.writeToTerminal?.(message);
  };

  // Reset setup state when forceResetup changes
  useEffect(() => {
    if (forceResetup) {
      setIsSetupComplete(false);
      setIsSetupInProgress(false);
      setSetupError(null);
      setPreviewUrl("");
      setCurrentStep(0);

      setLoadingState({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false,
      });
    }
  }, [forceResetup]);

  // Main WebContainer setup
  useEffect(() => {
    let cancelled = false;

    async function setupContainer() {
      if (!instance || isSetupComplete || isSetupInProgress) return;

      try {
        setIsSetupInProgress(true);
        setSetupError(null);

        let packageJsonText: string | null = null;
        let shouldInstall = true;

        // Check whether project files are already mounted
        try {
          packageJsonText = await instance.fs.readFile(
            "package.json",
            "utf8"
          );

          writeTerminal(
            "🔄 Existing project detected. Checking dependencies...\r\n"
          );

          // Check whether node_modules already exists
          try {
            await instance.fs.readdir("node_modules");

            shouldInstall = false;

            writeTerminal(
              "✅ Dependencies already exist. Skipping installation.\r\n"
            );
          } catch {
            shouldInstall = true;

            writeTerminal(
              "📦 Dependencies not found. Installation required.\r\n"
            );
          }
        } catch {
          packageJsonText = null;
        }

        // STEP 1: Transform template
        if (!packageJsonText) {
          setLoadingState((prev) => ({
            ...prev,
            transforming: true,
          }));

          setCurrentStep(1);

          writeTerminal("🔄 Transforming template data...\r\n");

          const files = transformToWebContainerFormat(templateData);

          if (cancelled) return;

          setLoadingState((prev) => ({
            ...prev,
            transforming: false,
            mounting: true,
          }));

          setCurrentStep(2);

          // STEP 2: Mount files
          writeTerminal(
            "📁 Mounting files to WebContainer...\r\n"
          );

          await instance.mount(files);

          if (cancelled) return;

          writeTerminal(
            "✅ Files mounted successfully.\r\n"
          );

          setLoadingState((prev) => ({
            ...prev,
            mounting: false,
          }));

          shouldInstall = true;
        } else {
          setCurrentStep(2);

          setLoadingState((prev) => ({
            ...prev,
            transforming: false,
            mounting: false,
          }));
        }

        // STEP 3: Install dependencies
        if (shouldInstall) {
          setLoadingState((prev) => ({
            ...prev,
            installing: true,
          }));

          setCurrentStep(3);

          writeTerminal(
            "📦 Installing dependencies...\r\n"
          );

          const installProcess = await instance.spawn(
            "npm",
            ["install"]
          );

          // Stream installation output to terminal
          const outputPromise = installProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                writeTerminal(data);
              },
            })
          );

          // Wait for BOTH process completion and output stream completion
          const [installExitCode] = await Promise.all([
            installProcess.exit,
            outputPromise,
          ]);

          if (cancelled) return;

          if (installExitCode !== 0) {
            throw new Error(
              `Failed to install dependencies. Exit code: ${installExitCode}. Check terminal output for the npm error.`
            );
          }

          writeTerminal(
            "✅ Dependencies installed successfully!\r\n"
          );
        } else {
          setLoadingState((prev) => ({
            ...prev,
            installing: false,
          }));
        }

        if (cancelled) return;

        setLoadingState((prev) => ({
          ...prev,
          transforming: false,
          mounting: false,
          installing: false,
          starting: true,
        }));

        setCurrentStep(4);

        // STEP 4: Start development server
        writeTerminal(
          "🚀 Starting development server...\r\n"
        );

        // Detect the appropriate start script
        let packageJson: any;

        try {
          const rawPackageJson = await instance.fs.readFile(
            "package.json",
            "utf8"
          );

          packageJson = JSON.parse(rawPackageJson);
        } catch {
          throw new Error(
            "Unable to read or parse package.json."
          );
        }

        const scripts = packageJson.scripts || {};

        const startScript = scripts.dev
          ? "dev"
          : scripts.start
            ? "start"
            : null;

        if (!startScript) {
          throw new Error(
            "No 'dev' or 'start' script found in package.json."
          );
        }

        writeTerminal(
          `▶ Running npm run ${startScript}...\r\n`
        );

        // Listen before starting the process
        instance.on("server-ready", (port: number, url: string) => {
          if (cancelled) return;

          writeTerminal(
            `🌐 Server ready on port ${port}: ${url}\r\n`
          );

          setPreviewUrl(url);

          setLoadingState({
            transforming: false,
            mounting: false,
            installing: false,
            starting: false,
            ready: true,
          });

          setIsSetupComplete(true);
          setIsSetupInProgress(false);
        });

        const startProcess = await instance.spawn(
          "npm",
          ["run", startScript]
        );

        // Stream development server output
        startProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              writeTerminal(data);
            },
          })
        ).catch((streamError) => {
          console.error(
            "Development server output error:",
            streamError
          );
        });

        // Detect if the server exits unexpectedly
        startProcess.exit.then((exitCode) => {
          if (cancelled || exitCode === 0) return;

          console.error(
            "Development server exited with code:",
            exitCode
          );

          setSetupError(
            `Development server exited with code ${exitCode}. Check terminal output.`
          );

          setIsSetupInProgress(false);
        });
      } catch (err) {
        if (cancelled) return;

        console.error("Error setting up container:", err);

        const errorMessage =
          err instanceof Error
            ? err.message
            : String(err);

        writeTerminal(
          `❌ Error: ${errorMessage}\r\n`
        );

        setSetupError(errorMessage);
        setIsSetupInProgress(false);

        setLoadingState({
          transforming: false,
          mounting: false,
          installing: false,
          starting: false,
          ready: false,
        });
      }
    }

    setupContainer();

    return () => {
      cancelled = true;
    };
  }, [
    instance,
    templateData,
    isSetupComplete,
    isSetupInProgress,
  ]);

  // Dynamically load terminal
  useEffect(() => {
    let mounted = true;

    import("./terminal")
      .then(({ default: Terminal }) => {
        if (mounted) {
          setTerminalComponent(() => Terminal);
        }
      })
      .catch((error) => {
        console.error("Failed to load terminal:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />

          <h3 className="text-lg font-medium">
            Initializing WebContainer
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Setting up the environment for your project...
          </p>
        </div>
      </div>
    );
  }

  if (error || setupError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5" />

            <h3 className="font-semibold">
              Error
            </h3>
          </div>

          <p className="text-sm">
            {error || setupError}
          </p>
        </div>
      </div>
    );
  }

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return (
        <CheckCircle className="h-5 w-5 text-green-500" />
      );
    }

    if (stepIndex === currentStep) {
      return (
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      );
    }

    return (
      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    );
  };

  const getStepText = (
    stepIndex: number,
    label: string
  ) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;

    return (
      <span
        className={`text-sm font-medium ${
          isComplete
            ? "text-green-600"
            : isActive
              ? "text-blue-600"
              : "text-gray-500"
        }`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="h-full w-full flex flex-col">
      {!previewUrl ? (
        <div className="h-full flex flex-col">
          <div className="w-full max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto">
            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2 mb-6"
            />

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                {getStepIcon(1)}
                {getStepText(1, "Transforming template data")}
              </div>

              <div className="flex items-center gap-3">
                {getStepIcon(2)}
                {getStepText(2, "Mounting files")}
              </div>

              <div className="flex items-center gap-3">
                {getStepIcon(3)}
                {getStepText(3, "Installing dependencies")}
              </div>

              <div className="flex items-center gap-3">
                {getStepIcon(4)}
                {getStepText(4, "Starting development server")}
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            {TerminalComponent ? (
              <TerminalComponent
                ref={terminalRef}
                webContainerInstance={instance}
                theme="dark"
                className="h-full"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Loading terminal...
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
            />
          </div>

          <div className="h-64 border-t">
            {TerminalComponent ? (
              <TerminalComponent
                ref={terminalRef}
                webContainerInstance={instance}
                theme="dark"
                className="h-full"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                Loading terminal...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;
