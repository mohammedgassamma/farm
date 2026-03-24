export const APP_KEY = "GAMOU_FARMS";

export const isJsonString = (str: string) => {
  try {
    const result = JSON.parse(str);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsy, so this suffices:
    if (result && typeof result === "object") {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
};

const STORAGE_TYPE = {
  LOCAL_STORAGE: typeof window !== "undefined" ? localStorage : null,
  SESSION_STORAGE: typeof window !== "undefined" ? sessionStorage : null,
};

export interface IAppStorage {
  storageType?: keyof typeof STORAGE_TYPE;
}

export const AppStorage = ({
  storageType = "LOCAL_STORAGE",
}: IAppStorage = {}) => {
  const storage = STORAGE_TYPE[storageType];

  const addKey = (key: string) => `${APP_KEY}_${key}`;

  const getFromStore = (key: string) => {
    const result = storage?.getItem(addKey(key));
    if (!result) return result;
    const isJson = isJsonString(result);
    return isJson ? JSON.parse(result) : result;
  };

  const addToStore = (key: string, value: any) => {
    storage?.setItem(
      addKey(key),
      typeof value === "object" ? JSON.stringify(value) : value
    );
  };

  const removeFromStore = (key: string) => {
    storage?.removeItem(addKey(key));
  };

  const removeMultipleFromStore = (records: string[]) => {
    for (const key of records) {
      removeFromStore(key);
    }
  };

  const addMultipleToStore = (records: Record<string, any>) => {
    const recordKeys = Object.keys(records);
    for (const key of recordKeys) {
      const value = records[key];
      addToStore(key, value);
    }
  };

  const getMultipleFromStore = (records: string[]) => {
    const result = [];
    for (const key of records) {
      const value = getFromStore(key);
      result.push(value);
    }

    return result;
  };

  const clearStore = () => {
    return storage?.clear();
  };

  return {
    addToStore,
    addMultipleToStore,
    removeFromStore,
    removeMultipleFromStore,
    getMultipleFromStore,
    getFromStore,
    clearStore,
  };
};
