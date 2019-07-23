import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'

function mapStateToProps(state){
  return {}
}
class PrivateHeader extends React.Component {
    render() {
        return (
            <div>
                <div>
                    Header
                </div>
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/page1">Page1</Link>
                        </li>
                        <li>
                            <Link to="/page2">Page2</Link>
                        </li>
                        <li>
                            <Link to="/">logout</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(PrivateHeader);
