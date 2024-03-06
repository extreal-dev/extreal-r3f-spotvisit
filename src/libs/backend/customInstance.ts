/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export class RequestTimeoutError extends Error {}
export type ErrorType<Error> = AxiosError<Error>;

// Change to refer environment variable if you needed
const timeout = 15000;
const REQUEST_TIMEOUT: number | undefined = isNaN(timeout)
  ? undefined
  : timeout;

// Change to refer environment variable if you needed
const BASE_URL: string = "http://localhost:3000";
const backendUrl = `${BASE_URL}`;
const AXIOS_INSTANCE = Axios.create({ baseURL: backendUrl });

const getDefaultAxiosConfig = () => {
  return {
    headers: {
      Accept: "application/json",
    },
  } as AxiosRequestConfig;
};

const customInstance = <T>(
  axiosInstance: AxiosInstance,
): ((config: AxiosRequestConfig) => Promise<AxiosResponse<T>>) => {
  const defaultAxiosConfig = getDefaultAxiosConfig();
  return (config: AxiosRequestConfig) => {
    const source = Axios.CancelToken.source();
    const requestConfig = {
      ...defaultAxiosConfig,
      ...config,
      cancelToken: source.token,
    };
    const promise = axiosInstance(requestConfig);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    promise.cancel = () => {
      source.cancel("Query cancelled by react query");
    };

    let timeoutId: NodeJS.Timeout | null;
    if (REQUEST_TIMEOUT) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        source.cancel("Query cancelled by request timeout");
      }, REQUEST_TIMEOUT);
    }

    return promise
      .catch((error) => {
        if (Axios.isCancel(error)) {
          const cancelError = error as { message: string };
          if (cancelError.message === "Query cancelled by request timeout") {
            throw new RequestTimeoutError("Request Timeout");
          }
        }
        throw error;
      })
      .finally(() => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      });
  };
};

const backendCustomInstance = <T>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return customInstance<T>(AXIOS_INSTANCE)(config);
};

// set additional header. For example, jwt token of API.
const setCustomHeader = (headerName: string, value: string) => {
  AXIOS_INSTANCE.defaults.headers.common[headerName] = value;
};

export { AXIOS_INSTANCE, backendCustomInstance, setCustomHeader };
