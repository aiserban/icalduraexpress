import React from 'react';

export default class App extends React.Component {
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

        return (
            <div>
                <p>HELLOOOO ITS WORKING</p>
            </div>
        )
        // const { users } = this.state;
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
