import type {
  TemplateFile,
  TemplateFolder,
  TemplateItem,
} from "@/modules/playground/lib/path-to-json";


interface WebContainerFile {
  file: {
    contents: string;
  };
}

interface WebContainerDirectory {
  directory: {
    [key: string]: WebContainerFile | WebContainerDirectory;
  };
}

type WebContainerFileSystem = Record<
  string,
  WebContainerFile | WebContainerDirectory
>;

function isTemplateFolder(item: TemplateItem): item is TemplateFolder {
  return "folderName" in item;
}

function getItemName(item: TemplateItem): string {
  if (isTemplateFolder(item)) {
    return item.folderName;
  }

  return item.fileExtension
    ? `${item.filename}.${item.fileExtension}`
    : item.filename;
}

export function transformToWebContainerFormat(
  template: TemplateFolder
): WebContainerFileSystem {
  function processItem(
    item: TemplateItem
  ): WebContainerFile | WebContainerDirectory {
    if (isTemplateFolder(item)) {
      const directoryContents: WebContainerFileSystem = {};

      item.items.forEach((subItem) => {
        directoryContents[getItemName(subItem)] = processItem(subItem);
      });

      return {
        directory: directoryContents,
      };
    }

    return {
      file: {
        contents: item.content,
      },
    };
  }

  const result: WebContainerFileSystem = {};

  template.items.forEach((item) => {
    result[getItemName(item)] = processItem(item);
  });

  return result;
}
