import {useEffect, useState, useCallback} from "react";
import {useDispatch} from "react-redux";
import {addData} from "../redux/slices/dataSlice";

export const useFetch = () => {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const fetchData = useCallback(
		async ({url, query, applyData}) => {
			setLoading(true);
			try {
				const response = await fetch(
					url ||
						`http://localhost:3001/api?${
							query ||
							`last=${Date.now()}&first=${
								Date.now() - 20000 * 60
							}`
						}`,
					{
						method: "GET",
					}
				);
				if (!response.ok) {
					setError(response.status.toString());
				}
				const dataToSet = await response.json();
				applyData(dataToSet);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		},
		[dispatch, setLoading]
	);
	return {
		error,
		loading,
		fetchData,
	};
};
