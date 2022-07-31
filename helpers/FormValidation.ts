import * as yup from 'yup';

const registration = yup.object().shape({
  name: yup.string().required('Full Name is required.'),
  email: yup
    .string()
    .email('Must be a valid email.')
    .max(255)
    .required('Email is required.'),
  mobilenumber: yup
    .string()
    .required('Mobile Number is required.')
    .matches(/^([0-9]{10})$/gm, 'Phone number is invalid!'),
  gender: yup.string().notRequired(),
  address: yup.string().notRequired(),
  city: yup.string().notRequired(),
  state: yup.string().notRequired(),
  password: yup
    .string()
    .required('Password is required.')
    .min(8, 'Password must be 8 characters long.')
    .matches(
      /^(?=.*[0-9])(?=.*[!@#\$%\^&\?\*])(?=.{8,})/,
      'Must Contain 8 Characters, One Number and One Special Case Character.',
    ),
  cpassword: yup
    .string()
    .required('Confirm Password is required.')
    .oneOf([yup.ref('password'), null], 'Passwords must match.'),
});

const signinValidation = yup.object().shape({
  email: yup.string().required('Email is missing!'),
  password: yup.string().required('Password is missing! '),
});

const resetPasswordValidation = yup.object().shape({
  password: yup
    .string()
    .required('Password is required.')
    .min(8, 'Password must be 8 characters long.')
    .matches(
      /^(?=.*[0-9])(?=.*[!@#\$%\^&\?\*])(?=.{6,})/,
      'Must Contain 8 Characters, One Number and One Special Case Character.',
    ),
  cpassword: yup
    .string()
    .required('Confirm Password is required.')
    .oneOf([yup.ref('password'), null], 'Passwords must match.'),
});
const RecoverScehma = yup.object().shape({
  email: yup.string().email('Must be a valid email.').max(255).notRequired(),
  phoneNum: yup
    .string()
    .notRequired()
    .matches(/^([0-9]{10})$/gm, 'Phone number is invalid!'),
  // .max(10),
});
const Contactvalid = yup.object().shape({
  name: yup.string().required('Name is missing! '),
  email: yup
    .string()
    .email('Must be a valid email.')
    .max(255)
    .required('Email is missing!'),
  message: yup.string().required('Message is missing! '),
});
const shipAddress = yup.object().shape({
  fname: yup.string().required('First name is missing! '),
  lname: yup.string().notRequired(),
  add1: yup.string().required('Address 1 is missing! '),
  add2: yup.string().notRequired(),
  mobilenumber: yup
    .string()
    .required('Mobile Number is required.')
    .matches(/^([0-9]{10})$/gm, 'Phone number is invalid!'),
  city: yup.string().required('City is missing! '),
  zip: yup
    .string()
    .notRequired()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(5, 'Must be exactly 5 digits')
    .max(5, 'Must be exactly 5 digits'),
});

const editProfile = yup.object().shape({
  fullname: yup.string().notRequired(),
  // 'First name is missing! '),
  gender: yup.string().notRequired(),
  // 'Gender is missing! '),
  address: yup.string().notRequired(),
  // required('Address  is missing! '),
  mobilenumber: yup
    .string()
    .required('Mobile Number is required.')
    .matches(/^([0-9]{10})$/gm, 'Phone number is invalid!')
    .max(10),
  city: yup.string().notRequired(),
  state: yup.string().notRequired(),

  email: yup.string().email('Must be a valid email.').max(255).notRequired(),
});
const updatePass = yup.object({
  password: yup.string().required('Passsword is Required'),
  npassword: yup
    .string()
    .required('Password is required.')
    .min(8, 'Password must be 8 characters long.')
    .matches(
      /^(?=.*[0-9])(?=.*[!@#\$%\^&\?\*])(?=.{8,})/,
      'Must Contain 8 Characters, One Number and One Special Case Character.',
    ),
  cpassword: yup
    .string()
    .required('Confirm Password is required.')
    .oneOf([yup.ref('npassword'), null], 'Passwords must match.'),
});

export {
  registration,
  signinValidation,
  resetPasswordValidation,
  RecoverScehma,
  Contactvalid,
  shipAddress,
  editProfile,
  updatePass,
};
