import { CentPrecisionMoney, TypedMoney } from "@commercetools/platform-sdk";

export function convertMoneyToText(money: TypedMoney | CentPrecisionMoney) {
  if (
    money.type === 'centPrecision' &&
    money.centAmount &&
    money.fractionDigits
  ) {
    const amount = money.centAmount / Math.pow(10, money.fractionDigits);
    return money.currencyCode + ' ' + amount;
  }
  return '';
}
