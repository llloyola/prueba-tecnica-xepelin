import React, { useState } from 'react';
import { useAsync } from "react-use";
import { Navigate } from 'react-router-dom';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { getCurrentUser, logout } from '../../services/auth.service';
import isNumeric from '../../utils/isNumeric';
import sendEmail from '../../services/sendEmail';
import './Table.css';

// Config variables
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const loadInitialState = async () => {
  // Initialize the sheet
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    // loads document properties and worksheets
    await doc.loadInfo();
    const sheet = doc.sheetsById[SHEET_ID];
    const rows = await sheet.getRows();

    return rows;
  }
  catch (e) {
    console.error('Error: ', e);
    return null;
  }
}

function Table() {
    let data = useAsync(loadInitialState, []);
	const [errorsIndices, setErrorsIndices] = useState([]);
	const [logoutReady, setLogoutReady] = useState(false);
	const [previousData, setPreviousData] = useState([]);
	const [useEmail ,setUseEmail] = useState(false);

	const currentUser = getCurrentUser();

	const handleChange = (event, index) => {
		const originalColor = index % 2 ? '#f2f2f2' : 'white';
		const str = event.target.value;

		if (!isNumeric(str) && !errorsIndices.includes(index)) {
			setErrorsIndices([...errorsIndices, index]);
		} else if (isNumeric(str) && errorsIndices.includes(index)) {
			setErrorsIndices(errorsIndices.filter(errorIndex => errorIndex !== index));
		}
		
		event.target.style.backgroundColor = !isNumeric(str) ? 'rgb(227, 87, 87)' : originalColor;
	}

	const handleBlur = async (event, row) => {
		const str = event.target.value;

		if (isNumeric(str)) {
			row['Tasa'] = str;
			await row.save();
			await sendEmail(row['id Op'], row['Tasa'], "llloyola@uc.cl")
				.then(() => {
					sendEmail(row['id Op'], row['Tasa'], currentUser['email']);
				})
		}
	}

	const handleLogout = (event) => {
		event.preventDefault();
		logout();
		setLogoutReady(true);
	}

	if (data.value && !previousData.length) {
		setPreviousData(data.value.map((row) => ({'id Op': row['id Op'], 'Tasa': row['Tasa']})));
	}

	const handleRevert = (event) => {
		event.preventDefault();
		data.value.forEach(async (row, index) => {
			row['Tasa'] = previousData[index]['Tasa'];
			await row.save();
		});
		window.location.reload();
	}
 
    return (
		<>
			{logoutReady ? <Navigate to="/"/> : (
				<>
					<div className='navbar'>
						<h2>{currentUser ? `Hi, ${currentUser.name}!` : ''}</h2>
						<h2>Welcome to Luis' Internship Test</h2>
						<button onClick={e => handleLogout(e)}>Log out</button>
					</div>
					<div className='table-container' style={{ height: 500, width: 500, margin: 'auto' }}>
						{data.error
							? <h3> An error has ocurred </h3>
							: data.loading
								? <h3>Loading...</h3>
								: <>
									<table>
										<thead>
											<tr>
												<th>Id</th>
												<th>Rate</th>
											</tr>
										</thead>
										<tbody>
											{data.value && data.value.map((row, index) => (
												<tr key={row['id Op']}>
													<td>{row['id Op']}</td>
													<td className='rate'>
														<input
															type="text"
															defaultValue={row['Tasa']}
															onBlur={event => {handleBlur(event, row)}}
															onChange={event => handleChange(event, index)}
														/>
														<p className='error-msg'>{errorsIndices.includes(index) ? "Invalid number" : ""}</p>
													</td>
												</tr>
											))}
										</tbody>
									</table>
									{currentUser
										? (<button className="email" onClick={() => setUseEmail(!useEmail)}>{useEmail
											? <span>{`Don't send changes to ${currentUser['email']}`}</span>
											: <span>{`Send changes to ${currentUser['email']}`}</span>}
											</button>)
										:  <button className="email">Loading data...</button>
									}
									<button className="revert" onClick={e => handleRevert(e)}>Revert changes</button>
								</>
						}
					</div>
				</>
			)}
		</>
      );
}

export default Table;