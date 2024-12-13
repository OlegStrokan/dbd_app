import { generateUlid } from 'src/libs/generate-ulid';

export type BankAccountData = {
    bankAccountPrefix?: string;
    bankAccountNumber?: string;
    bankCode?: string;
    iban?: string;
    bic?: string;
};
export type RepaymentPreferencesData = {
    id: string;
    customerId: string;
    repaymentFrequency: string;
    repaymentType: string;
    bankAccount: BankAccountData;
    orderId: string;
    createdAt: Date;
    updatedAt: Date;
};

export class RepaymentPreferences {
    constructor(public readonly data: RepaymentPreferencesData) {}

    get id(): string {
        return this.data.id;
    }

    get customerId(): string {
        return this.data.customerId;
    }

    get repaymentFrequency(): string {
        return this.data.repaymentFrequency;
    }

    get repaymentType(): string {
        return this.data.repaymentType;
    }

    get bankAccountPrefix(): string | undefined {
        return this.data.bankAccount.bankAccountPrefix;
    }

    get bankAccountNumber(): string | undefined {
        return this.data.bankAccount.bankAccountNumber;
    }

    get bankCode(): string | undefined {
        return this.data.bankAccount.bankCode;
    }

    get iban(): string | undefined {
        return this.data.bankAccount.iban;
    }

    get bic(): string | undefined {
        return this.data.bankAccount.bic;
    }

    get orderId(): string {
        return this.data.orderId;
    }

    get createdAt(): Date {
        return this.data.createdAt;
    }

    get updatedAt(): Date {
        return this.data.updatedAt;
    }

    static createWithIdAndDate(
        data: Omit<RepaymentPreferencesData, 'id' | 'createdAt' | 'updatedAt'>
    ): RepaymentPreferences {
        return new RepaymentPreferences({
            ...data,
            id: generateUlid(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static updateRepaymentDetails(
        preferences: RepaymentPreferences,
        updates: Partial<Omit<RepaymentPreferencesData, 'id' | 'orderId' | 'createdAt'>>
    ): RepaymentPreferences {
        return new RepaymentPreferences({
            ...preferences.data,
            ...updates,
            updatedAt: new Date(),
        });
    }
}
