import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
	mutation login($emailOrUsername: String!, $password: String!) {
		login(emailOrUsername: $emailOrUsername, password: $password) {
			id
			jwt
			username
		}
	}
`;

export default LOGIN_MUTATION;
