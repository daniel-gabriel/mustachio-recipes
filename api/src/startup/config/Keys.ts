export default class Keys {
    // add config keys in here
    public static NODE_ENV = this.procVar("NODE_ENV");
    public static PORT = this.procVar("PORT", "3000");
    public static OPENAI_API_KEY = this.procVar("OPENAI_API_KEY",
        "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");

    private static procVar(varName: string, defaultVal?: string): string | undefined {
        return process.env[varName] || defaultVal;
    }
}