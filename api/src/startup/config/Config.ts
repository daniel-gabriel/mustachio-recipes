export default class Config {
    // add config keys in here
    public static NODE_ENV = this.procVar("NODE_ENV");
    public static API_PORT = this.procVar("API_PORT", "3000");
    public static OPENAI_API_KEY = this.procVar("OPENAI_API_KEY");
    public static LLM_PROVIDER_URL = this.procVar("LLM_PROVIDER_URL");
    public static MONGO_CONNECTION_STRING = this.procVar("MONGO_CONNECTION_STRING");

    private static procVar(varName: keyof typeof Config, defaultVal?: string): string | undefined {
        return process.env[varName] || defaultVal;
    }
}