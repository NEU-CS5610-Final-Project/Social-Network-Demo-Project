import { Navigate, Route, Routes } from "react-router"
import AccountNavigation from "./Navigation"
import Account from "./Account"
import Session from "./Account/Session"

export default function MovieNetwork() {
    return (
        <Session>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Movie Network</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td valign="top">
                                <AccountNavigation />
                            </td>
                            <td>
                                <Routes>
                                    <Route path="/" element={<Navigate to="Account" />} />
                                    <Route path="/Account/*" element={<Account />} />
                                </Routes>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Session>
    )
}
