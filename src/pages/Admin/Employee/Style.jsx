export const neumorphismStyles = {
  appBar: {
    background: "#e0e0e0",
    boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
    borderRadius: "12px",
    padding: "8px 16px",
    margin: "8px",
  },
  iconButton: {
    background: "#e0e0e0",
    boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
    borderRadius: "50%",
    padding: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
    },
  },
  title: {
    fontWeight: "bold",
    color: "#555",
    textShadow: "1px 1px 2px #bebebe",
    flexGrow: 1,
  },
  subtitle: {
    fontStyle: "italic",
    color: "#777",
    textShadow: "1px 1px 2px #bebebe",
    display: "flex",
    alignItems: "center",
  },
  logoutButton: {
    background: "#e0e0e0",
    boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
    borderRadius: "12px",
    padding: "6px 12px",
    fontSize: "0.575rem",
    marginLeft: "12px",
    "&:hover": {
      background: "#d1d9e6",
    },
  },
  logoBox: {
    background: "#e0e0e0",
    boxShadow: "inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    marginRight: "8px",
  },
  container: {
    p: 3,
    background: '#E0E5EC',
    borderRadius: '20px',
    boxShadow: '10px 10px 20px #bebebe, -10px -10px 20px #ffffff',
  },
  paper: {
    p: 3,
    background: '#E0E5EC',
    borderRadius: '20px',
    boxShadow: '10px 10px 20px #bebebe, -10px -10px 20px #ffffff',
  },
  button: {
    borderRadius: '30px',
    background: '#E0E5EC',
    boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
    '&:hover': {
      background: '#E0E5EC',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
    },
  },
  input: {
    background: '#E0E5EC',
    borderRadius: '10px',
    boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
  },
  alert: {
    borderRadius: '10px',
    boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
  },
  circularProgress: {
    color: '#444',
    filter: 'drop-shadow(2px 2px 4px #bebebe)',
  },
  typography: {
    color: '#333',
    textShadow: '1px 1px 2px #bebebe',
  },
  container2: {
    background: "#E0E5EC",
    borderRadius: "12px",
    boxShadow: "8px 8px 16px #b8b9be, -8px -8px 16px #ffffff",
    padding: "20px",
  },
  button2: {
    background: "#E0E5EC",
    borderRadius: "8px",
    boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
    '&:hover': {
      background: '#E0E5EC',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
    },
  },
  cell: {
    background: "#E0E5EC",
    boxShadow: "inset 3px 3px 5px #b8b9be, inset -3px -3px 5px #ffffff",
  }
};
