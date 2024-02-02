import fs from "fs";
import path from "path";

const baseDir = "assets";
const targetDir = "icons";

async function collectAllFilesRecursively(
  baseDir: string,
  fileFilter: (fileName: string) => boolean
): Promise<string[]> {
  const files = await fs.promises.readdir(baseDir);
  const allFiles = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(baseDir, file);
      const stats = await fs.promises.stat(fullPath);
      if (stats.isDirectory()) {
        return collectAllFilesRecursively(fullPath, fileFilter);
      } else {
        return fileFilter(file) ? [fullPath] : [];
      }
    })
  );
  return allFiles.flat();
}

(async () => {
  const allIcons = await collectAllFilesRecursively(
    baseDir,
    (fileName) => fileName.endsWith(".svg") || fileName.endsWith(".png")
  );

  for (const iconFile of allIcons) {
    await fs.promises.copyFile(
      iconFile,
      path.join(targetDir, path.basename(iconFile))
    );
  }
})();
