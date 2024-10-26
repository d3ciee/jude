type ServiceMethodOutput<T> = {
    isSuccess: true;
    data: T;
} | {
    isSuccess: false;
    message: string;
}