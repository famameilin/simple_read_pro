import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
type ConvertResult = {
  data: string;
  originalEncoding: string;
  bytesProcessed?: number;
};
export interface Spec extends TurboModule {
  convertToUtf8Async(uri: string): Promise<ConvertResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeFileEncoding',
) as Spec;
