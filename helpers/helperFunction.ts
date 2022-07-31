import {setPath} from '../redux/reducer/authSlice';
import store from '../redux/store';

function setNavigationPath(path: string | undefined) {
  store.dispatch(setPath(path));
}
function getNavigationPath() {
  return store.getState().authReducer.customNavigationPath;
}
export {setNavigationPath, getNavigationPath};
