import NativeFileEncoding from '../../specs/NativeFileEncoding.ts';
import RNFS from 'react-native-fs';

interface SaveFileInDocumentOptions {
    type: 'novel' | 'comic'
}

const getUtf8Content = async (uri: string): Promise<string> => {
    const convertResult = await NativeFileEncoding.convertToUtf8Async(uri);
    return convertResult.data;
}
const saveFileInDocument = async (uri: string, options: SaveFileInDocumentOptions = {type: 'novel'}) => {
    if (!RNFS.DocumentDirectoryPath) {throw new Error('文档目录未定义');}
    console.log(RNFS.DocumentDirectoryPath);
    const fileName = uri.split('/').pop();
    if(!await RNFS.exists(RNFS.DocumentDirectoryPath + '/' + options.type)) {
        console.log('创建目录');
        await RNFS.mkdir(RNFS.DocumentDirectoryPath + '/' + options.type);
    }
    const fileUri = RNFS.DocumentDirectoryPath + '/' + options.type + '/' + fileName;
    console.log(uri,fileUri);
    await  RNFS.copyFile(uri, fileUri);
    return fileUri;
}
const uint8ToBase64 =  (uint8:Uint8Array|undefined) => {
    if (!uint8) {return undefined;}
    return Buffer.from(uint8).toString('base64');
};

export {
    getUtf8Content,
    saveFileInDocument,
    uint8ToBase64,
}
