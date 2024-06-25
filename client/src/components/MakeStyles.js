import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 200;

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Futura, Arial, sans-serif',
    backgroundColor: '#a8a7a7',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#363636',
    color: '#a8a7a7',
    border: 'none',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 0,
    transition: 'margin-top 0.3s ease',
  },
  button: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#363636',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#e8175d',
    },
  },
  selectedButton: {
    backgroundColor: '#a8a7a7',
    color: '#FFF',
  },
  selected: {
    backgroundColor: '#e8175d',
    color: '#FFF',
  },
  selectedImage: {
    marginBottom: theme.spacing(2),
  },
  input: {
    display: 'none',
  },
  dropZone: {
    width: '50%',
    height: '150px',
    border: '2px dashed #ccc',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: '#FFF',
    fontFamily: 'Graphik, Arial, sans-serif',
  },
  selectedImageText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    fontFamily: 'Graphik, Arial, sans-serif',
  },
  image: {
    width: '300px',
    height: 'auto',
  },
}));

export default useStyles;
