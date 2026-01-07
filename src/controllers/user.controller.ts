import {TokenService, authenticate} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  HttpErrors,
  SchemaObject,
  get,
  getModelSchemaRef,
  post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';

//User-modell
@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

}

//Uppgifter CredentialsSchema ska bestå av
const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

//Request body ska ha med CredentialsSchema och dess uppgifter
export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};


export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }



  //Route för att en användare ska kunna logga in
  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody)
    credentials: Credentials
  ): Promise<{token: string; user: {id: string, email: string, name: string, role: string}}> {
    //Kolla om användaren finns och att lösenordet är rätt för användaren
    const user = await this.userService.verifyCredentials(credentials);

    //Omvandling av User object till en User Profile
    const userProfile = this.userService.convertToUserProfile(user);

    //Skapa en JSON Web Token för inloggningen och den specifika användaren
    const token = await this.jwtService.generateToken(userProfile);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  //Funktion för att visa den inloggade användaren
  @authenticate('jwt')
  @get('/loggedIn', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async loggedIn(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,


  ): Promise<string> {
    console.log(currentUserProfile);
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async singUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    //Kollar om e-postadressen som ska registreras finns sparad redan
    const existingEmail = await this.userRepository.findOne({
      where: {email: newUserRequest.email},
    });

    //Om användaren redan finns skickas ett felmeddelande
    if (existingEmail) {
      throw new HttpErrors.Conflict('En användare med den här e-postadressen är redan registrerad');
    }

    const password = await hash(newUserRequest.password, await genSalt());

    //Skapa en användare att spara med fler argument
    const userArgs = {
      ..._.omit(newUserRequest, 'password'),
      role: newUserRequest.role ?? 'user',
      name: newUserRequest.name ?? 'name',
    }

    const savedUser = await this.userRepository.create(
      userArgs
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }

}
