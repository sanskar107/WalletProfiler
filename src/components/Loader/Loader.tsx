import { Blocks } from 'react-loader-spinner';
import { FC } from "react";

interface Loader {loaded: Boolean}
const Loader: FC<Loader> = (props) => {
    if (props.loaded) {
        return (<div></div>);
    }
    return (<Blocks
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
    />);
}

export default Loader;

