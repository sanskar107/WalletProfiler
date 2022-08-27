import { FC, useState } from 'react';
import './NavSearch.css';

interface NavSearchProps{

}

const NavSearch: FC<NavSearchProps> = (props) => {

    const [value, setValue] = useState('');
    const [showValue, setShowValue] = useState(false)
    return (
        <div>
            <form className="d-flex">
                <input 
                    className="form-control me-2" 
                    type="search" 
                    value={value} 
                    placeholder="Search" 
                    aria-label="Search"
                    onChange={(e) => {setValue(e.target.value); setShowValue(false)}}
                />
                <button className="btn btn-outline-success"  onClick={()=>{setShowValue(true)}}>Search</button>
                
            </form>
            <div hidden={!showValue}>
                {value}
            </div>
        </div>
        
    )
}

export default NavSearch;