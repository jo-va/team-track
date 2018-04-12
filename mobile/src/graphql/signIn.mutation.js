import gql from 'graphql-tag';
import USER_FRAGMENT from './user.fragment';

const SIGNIN_MUTATION = gql`
	mutation signIn($emailOrUsername: String!, $password: String!) {
		signIn(emailOrUsername: $emailOrUsername, password: $password) {
			jwt
			...UserFragment
		}
	}
	${USER_FRAGMENT}
`;

export default SIGNIN_MUTATION;
