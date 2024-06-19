import { REQ_METHODS } from '@/utils/constants'
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'

const axiosInstance = axios.create({
    timeout: 20000,
    baseURL: import.meta.env.VITE_API_BASE_URL,
})
export /**
 * @template T
 * @param {string} url
 * @param {Lowercase<Method>} [method]
 * @param {*} [data]
 * @param {AxiosRequestConfig} [config]
 * @return {*}  {Promise<AxiosResponse<T>>}
 */
const request = <T>(
    url: string,
    method?: Lowercase<Method>,
    data?: any,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
    const commonConfig: AxiosRequestConfig = {
        ...config,
    }
    axiosInstance.interceptors.request.use(
        (defaultConfig) => {
            const token = localStorage.getItem('accessToken')
            if (token && !defaultConfig.headers.getAuthorization()) {
                defaultConfig.headers.setAuthorization(`Bearer ${token}`)
            }
            if (!defaultConfig.headers.getContentType()) {
                defaultConfig.headers.setContentType('application/json')
            }
            return defaultConfig
        },
        (error) => {
            delete axios.defaults.headers.common['Authorization']
            Promise.reject(error)
        }
    )

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (
                error.response.status === 401 &&
                localStorage.getItem('token')
            ) {
                localStorage.removeItem('token')
                delete axios.defaults.headers.common['Authorization']
                window.location.href = '/login'
            }
            return Promise.reject(error)
        }
    )
    switch (method) {
        case REQ_METHODS.POST:
            return axiosInstance.post(url, data, commonConfig)
        case REQ_METHODS.PATCH:
            return axiosInstance.patch(url, data, commonConfig)
        case REQ_METHODS.PUT:
            return axiosInstance.put(url, data, commonConfig)
        case REQ_METHODS.DELETE:
            return axiosInstance.delete(url, commonConfig)
        default:
            return axiosInstance.get(url, {
                params: data,
                ...commonConfig,
            })
    }
}

// eslint-disable-next-line import/no-unused-modules
export default axiosInstance
