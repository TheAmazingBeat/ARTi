import '../styles/backdrop.css'

export default function Backdrop({ page, loading, colorPalette }) {
  // const { colorPalette } = useContext(ItemsContext)
  return (
    <div className='backdrop-container'>
      {/* <div
        className={`${styles['bg-circle']} ${styles.circle1} ${styles[page]}`}
      ></div>
      <div
        className={`${styles['bg-circle']} ${styles.circle2} ${styles[page]}`}
      ></div>
      <div
        className={`${styles['bg-circle']} ${styles.circle3} ${styles[page]}`}
      ></div>
      <div
        className={`${styles['bg-circle']} ${styles.circle4} ${styles[page]}`}
      ></div> */}

      {/* bottom right circle, 1: top left circle */}
      <div
        className={`bg-circle circle ${loading ? 'pulsate' : ''}`}
        style={{
          backgroundImage: `radial-gradient(
            farthest-corner at 10% 25%, 
            ${colorPalette === undefined ? '#8cbab4' : colorPalette[0]} 20%, 
            ${colorPalette === undefined ? '#52908c' : colorPalette[1]} 35%, 
            ${colorPalette === undefined ? '#1b3b38' : colorPalette[2]} 50%
            )`,
        }}
      ></div>
      <div
        className={`bg-circle1 circle1 ${loading ? 'pulsate' : ''}`}
        style={{
          backgroundImage: `radial-gradient(
            farthest-corner at 85% 90%, 
            ${colorPalette === undefined ? '#8cbab4' : colorPalette[0]} 20%, 
            ${colorPalette === undefined ? '#52908c' : colorPalette[1]} 35%, 
            ${colorPalette === undefined ? '#1b3b38' : colorPalette[2]} 50%
            )`,
        }}
      ></div>
    </div>
  )
}
