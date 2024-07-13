import { useEffect } from 'react';
import getUserInfo from '../api/getUserInfo';
import refreshToken from '../../auth/api/refreshToken';

const Profile = () => {
  const onRefresh = async () => {
    await refreshToken();
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div>
      index <button onClick={onRefresh}>refresh</button>
    </div>
  );
};

export default Profile;
