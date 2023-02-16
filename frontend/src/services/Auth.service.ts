import useAxiosCustom from "./Api.service";

export interface IAuth {
  _id: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
}

const getAuthorizeUrl = () => {
  return useAxiosCustom<string>({
    url: `/auth/authorize-url`,
  });
};

export default { getAuthorizeUrl };
