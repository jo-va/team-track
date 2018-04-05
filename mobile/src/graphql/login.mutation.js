import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
	mutation login($emailOrUsername: String!, $password: String!) {
		jwt: login(emailOrUsername: $emailOrUsername, password: $password) 
	}
`;

export default LOGIN_MUTATION;
