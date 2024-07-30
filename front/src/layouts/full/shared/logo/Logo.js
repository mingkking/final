import { Link } from 'react-router-dom';
import { ReactComponent as LogoDark } from '../../../../assets/images/logos/Logo.svg';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: 'auto',
  width: '200px',
  display: 'block',
  marginLeft: '25px',
  marginTop: '20px'
}));

const Logo = () => {
  return (
    <LinkStyled to="/manager/main">
      <LogoDark style={{ width: '100%' }} />
    </LinkStyled>
  )
};

export default Logo;
