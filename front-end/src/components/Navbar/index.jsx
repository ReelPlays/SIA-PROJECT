export default function Navbar() {
    return (
      <div style={{
        backgroundColor: '#1877f2',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div>SocialApp</div>
        <div>Search</div>
        <div>Profile</div>
      </div>
    );
  }