"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App extends _react.default.Component {
  // state = {
  //     users: [
  //         { name: 'Andreas', email: 'andreas@gmail.com' }
  //     ],
  // };
  // componentDidMount() {
  // axios.get("/users.json").then((response) => {
  //     this.setState({ users: response.data });
  // });
  // }
  render() {
    return <div>
                <p>HELLOOOO</p>
            </div>; // const { users } = this.state;
    // return (
    //     <div>
    //         <h1>Users below</h1>
    //         <ul className="users">
    //             {users.map((user) => (
    //                 <li className="user">
    //                     <p>
    //                         <strong>Name:</strong> {user.name}
    //                     </p>
    //                     <p>
    //                         <strong>Email:</strong> {user.email}
    //                     </p>
    //                 </li>
    //             ))}
    //         </ul>
    //     </div>
    // );
  }

}

exports.default = App;