package com.nativefileencoding

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeFileEncodingPackage : BaseReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == NativeFileEncodingModule.NAME) {
            NativeFileEncodingModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleMap = HashMap<String, ReactModuleInfo>()
            moduleMap[NativeFileEncodingModule.NAME] = ReactModuleInfo(
                NativeFileEncodingModule.NAME,   // name
                NativeFileEncodingModule::class.java.name, // class name
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                false,  // isCXXModule
                true    // isTurboModule
            )
            moduleMap
        }
    }
}
