import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ username, email, password });
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message) || "Registeration Failed",
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message) || "Registeration Failed",
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handlegetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message) || "Registeration Failed",
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handlegetMe,
  };
}
export default useAuth;
