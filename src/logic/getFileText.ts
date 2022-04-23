export default function (buffer: Buffer, fileName: string) {
  const fileNameParts = fileName.split('.');
  const fileExtension = fileNameParts[fileNameParts.length - 1];
  switch (fileExtension) {
    case 'txt':
      return buffer.toString();
    default:
      throw new Error('Only .txt file extension is supported so far');
  }
}
