import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'

function mapStateToProps(state){
  return {}
}
class PublicHeader extends React.Component {

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
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/myspace">Mon Espace</Link>
                        </li>
                        <li>
                            <Link to="/bo/matchs/team">Equipes</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(PublicHeader);
