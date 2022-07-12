import { environment } from '@app-env/environment';
import { AuthWebExtensionEffects } from '@app/store/auth/effects/auth.web-extension.effects';
import { AuthNativeAppEffects } from '@app/store/auth/effects/auth.native-app.effects';

export const authEffectFactory = () => {
    const targetPlatform = environment.target;

    switch (targetPlatform) {
        case 'web-extension':
            return [ AuthWebExtensionEffects ];
        case 'native-app':
            return [ AuthNativeAppEffects ];
    }
};
