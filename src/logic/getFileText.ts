import pdf from 'pdf-parse';

export default async function (buffer: Buffer, fileName: string) {
  const fileNameParts = fileName.split('.');
  const fileExtension = fileNameParts[fileNameParts.length - 1];
  switch (fileExtension) {
    case 'txt':
      return buffer.toString();
    case 'pdf':
      return new Promise((resolve) => {
        pdf(buffer).then(({ text }) => resolve(text));
      });
    default:
      throw new Error(
        `${fileExtension} file type is not supported. Supported typrs: .txt, pdf`
      );
  }
}
