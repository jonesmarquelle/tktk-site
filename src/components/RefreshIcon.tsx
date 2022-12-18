interface RefreshIconProps {
    className?: string,
    height?: string|number,
    width?: string|number,
    fill?: string,
}

const RefreshIcon: React.FC<RefreshIconProps> = (props) => {
    return (
        <svg 
        className={props.className}
        height={props.height} width={props.width} fill={props.fill} overflow="hidden"
        xmlns="http://www.w3.org/2000/svg" 
        x="0px" y="0px" viewBox="0 0 1000 1000" 
        enable-background="new 0 0 1000 1000">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                <path d="M4998.6,4332.9v-687.2l-223.9-13.4c-1054.6-59.3-2009.8-486.2-2750.5-1228.8C1019.3,1400.5,594.4-8.3,875.8-1407.4c116.8-587.6,371.3-1159.9,744.6-1674.8c158.9-218.2,629.7-689.1,861.3-859.4c1515.9-1117.8,3521.9-1117.8,5034,0c245,181.8,671.8,608.7,853.7,853.7c467,629.7,744.6,1351.3,819.2,2122.7c44,451.7,24.9,564.6-122.5,710.1C8880.4-67.6,8641.1-61.8,8444-239.9c-109.1-97.6-153.1-206.7-153.1-373.2c0-555.1-199.1-1225-511.1-1713.1c-601-947.5-1669.1-1537-2781.1-1537c-1374.3,0-2645.2,895.8-3098.9,2187.8C1589.7-793,1662.4,192.7,2098.8,989c553.2,1008.7,1548.5,1646.1,2695,1724.6l204.8,13.4l3.8-698.6l5.7-696.7l872.8,717.8c480.4,396.2,993.4,819.2,1142.7,943.6l271.8,222l-972.3,761.8c-534,419.2-1050.8,825-1146.5,903.4l-178,139.7V4332.9z"/>
            </g>
        </svg>
        /*
        <motion.svg 
            height={props.height} width={props.width} fill={props.fill} overflow="hidden"
            className={props.className} 
            viewBox="0 0 122.88 122.88"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm10,50.74A3.31,3.31,0,0,1,76,55.47L63.44,67.91a3.31,3.31,0,0,1-4.65,0L46.38,55.65A3.32,3.32,0,0,1,51,50.92l6.83,6.77.06-23.84a3.32,3.32,0,0,1,6.64.06l-.07,23.65,6.9-6.82ZM35,81.19l0-13a3.32,3.32,0,0,1,6.64.06l0,9.45q19.76,0,39.5,0l0-9.51a3.32,3.32,0,1,1,6.64.06l0,12.91h0a3.32,3.32,0,0,1-3.29,3.17q-23.08,0-46.15,0A3.32,3.32,0,0,1,35,81.19ZM99.44,23.44a53.74,53.74,0,1,0,15.74,38,53.58,53.58,0,0,0-15.74-38Z"/>
        </motion.svg>
        */
    );
}

/* <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                <path d="M4998.6,4332.9v-687.2l-223.9-13.4c-1054.6-59.3-2009.8-486.2-2750.5-1228.8C1019.3,1400.5,594.4-8.3,875.8-1407.4c116.8-587.6,371.3-1159.9,744.6-1674.8c158.9-218.2,629.7-689.1,861.3-859.4c1515.9-1117.8,3521.9-1117.8,5034,0c245,181.8,671.8,608.7,853.7,853.7c467,629.7,744.6,1351.3,819.2,2122.7c44,451.7,24.9,564.6-122.5,710.1C8880.4-67.6,8641.1-61.8,8444-239.9c-109.1-97.6-153.1-206.7-153.1-373.2c0-555.1-199.1-1225-511.1-1713.1c-601-947.5-1669.1-1537-2781.1-1537c-1374.3,0-2645.2,895.8-3098.9,2187.8C1589.7-793,1662.4,192.7,2098.8,989c553.2,1008.7,1548.5,1646.1,2695,1724.6l204.8,13.4l3.8-698.6l5.7-696.7l872.8,717.8c480.4,396.2,993.4,819.2,1142.7,943.6l271.8,222l-972.3,761.8c-534,419.2-1050.8,825-1146.5,903.4l-178,139.7V4332.9z"/>
            </g> */

export default RefreshIcon