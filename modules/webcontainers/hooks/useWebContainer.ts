import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContaierReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destory: () => void;
}

// WebContainer.boot() may only be called once per page. Keeping the promise
// outside React means Strict Mode's double effect run and re-mounts all
// share the same instance instead of booting a second one.
let bootPromise: Promise<WebContainer> | null = null;

function getWebContainer(): Promise<WebContainer> {
  if (!bootPromise) {
    bootPromise = WebContainer.boot().catch((err) => {
      bootPromise = null; // allow a retry if boot failed
      throw err;
    });
  }
  return bootPromise;
}

export const useWebContainer = ({
  templateData,
}: UseWebContainerProps): UseWebContaierReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeWebContainer() {
      try {
        const webcontainerInstance = await getWebContainer();

        if (!mounted) return;

        setInstance(webcontainerInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize WebContainer:", error);
        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to initialize WebContainer"
          );
          setIsLoading(false);
        }
      }
    }

    initializeWebContainer();

    // No teardown here: in dev, Strict Mode runs this cleanup right after the
    // first mount, which would kill the shared instance. Use destory() instead.
    return () => {
      mounted = false;
    };
  }, []);

  const writeFileSync = useCallback(
    async (path: string, content: string): Promise<void> => {
      if (!instance) {
        throw new Error("WebContainer instance is not available");
      }

      try {
        const pathParts = path.split("/");
        const folderPath = pathParts.slice(0, -1).join("/");

        if (folderPath) {
          await instance.fs.mkdir(folderPath, { recursive: true }); // Create folder structure recursively
        }

        await instance.fs.writeFile(path, content);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to write file";
        console.error(`Failed to write file at ${path}:`, err);
        throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
      }
    },
    [instance]
  );

  const destory = useCallback(() => {
    if (instance) {
      instance.teardown();
      bootPromise = null; // a fresh boot is allowed after teardown
      setInstance(null);
      setServerUrl(null);
    }
  }, [instance]);

  return { serverUrl, isLoading, error, instance, writeFileSync, destory };
};