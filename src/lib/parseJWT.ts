import jwt_decode from 'jwt-decode';

const parseJWT = (jwt: string): { [key: string]: any } => {
  try {
    return jwt_decode(jwt);
  } catch (e) {
    return {
      error: true,
      message: e.message,
    };
  }
};

export default parseJWT;
