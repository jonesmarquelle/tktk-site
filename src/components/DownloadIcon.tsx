interface DownloadIconProps {
    className?: string,
    height?: string|number,
    width?: string|number,
    fill?: string,
}

const DownloadIcon: React.FC<DownloadIconProps> = (props) => {
    return (
        <svg 
            height={props.height} width={props.width} fill={props.fill} overflow="hidden"
            className={props.className} 
            viewBox="0 0 122.88 122.88"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm10,50.74A3.31,3.31,0,0,1,76,55.47L63.44,67.91a3.31,3.31,0,0,1-4.65,0L46.38,55.65A3.32,3.32,0,0,1,51,50.92l6.83,6.77.06-23.84a3.32,3.32,0,0,1,6.64.06l-.07,23.65,6.9-6.82ZM35,81.19l0-13a3.32,3.32,0,0,1,6.64.06l0,9.45q19.76,0,39.5,0l0-9.51a3.32,3.32,0,1,1,6.64.06l0,12.91h0a3.32,3.32,0,0,1-3.29,3.17q-23.08,0-46.15,0A3.32,3.32,0,0,1,35,81.19ZM99.44,23.44a53.74,53.74,0,1,0,15.74,38,53.58,53.58,0,0,0-15.74-38Z"/>
        </svg>
    );
}

export default DownloadIcon