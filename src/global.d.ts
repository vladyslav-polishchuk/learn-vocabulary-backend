declare type User = {
  email: string;
};

declare type ExpressRequest = import('express').Request;

declare type ExpressResponse = import('express').Response;

declare type AuthorizedExpressRequest = ExpressRequest & { user: User };
