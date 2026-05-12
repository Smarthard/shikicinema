import {
    DefaultTranspiler,
    TranslocoTranspiler,
    TranspileParams,
} from '@jsverse/transloco';
import { IntlMessageFormat } from 'intl-messageformat';

// стандартный transloco transpiler не умеет в ICU формат
// а тот, что предлагают использовать в доках использует eval
// и форсит использовать unsafe-eval для CSP
export class ICUTranspiler extends DefaultTranspiler implements TranslocoTranspiler {
    public override transpile(transpileParams: TranspileParams) {
        const { value, params } = transpileParams;
        const hasParams = Object.keys(params as object).length > 0;
        const isPlural = /{.*?,\s?plural,\s?.*?}/.test(value as string);
        const isSelect = /{.*?,\s?select,\s?.*?}/.test(value as string);
        // TODO: возможно стоит добавить и другие форматы из ICU синтаксиса...

        if (hasParams && (isPlural || isSelect)) {
            return new IntlMessageFormat(value as string).format(params);
        } else {
            return super.transpile(transpileParams);
        }
    }
}
