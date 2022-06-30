import { GetI18nValue } from '../../../i18n';

export function getTranslatedMonthsLong(i18n: GetI18nValue) {
  return [
    '',
    i18n('January'),
    i18n('February'),
    i18n('March'),
    i18n('April'),
    i18n('May'),
    i18n('June'),
    i18n('July'),
    i18n('August'),
    i18n('September'),
    i18n('October'),
    i18n('November'),
    i18n('December')
  ];
}

export function getTranslatedMonthsShort(i18n: GetI18nValue) {
  return [
    '',
    i18n('jan'),
    i18n('feb'),
    i18n('mar'),
    i18n('apr'),
    i18n('may'),
    i18n('jun'),
    i18n('jul'),
    i18n('aug'),
    i18n('sep'),
    i18n('oct'),
    i18n('nov'),
    i18n('dec')
  ];
}
