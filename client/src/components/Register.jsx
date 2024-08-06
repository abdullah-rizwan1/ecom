import { useRef, useState, useEffect } from 'react'
import {
    faCheck,
    faTimes,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../api/axios'
import '../styles/register.css'
const NAME_REGEX = /^[A-z]{3,23}$/
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const REGISTER_URL = '/api/supplier/signup'

const Register = () => {
    const nameRef = useRef()
    const errRef = useRef()

    const [firstName, setFirstName] = useState('')
    const [validFirstName, setValidFirstName] = useState(false)
    const [firstNameFocus, setFirstNameFocus] = useState(false)

    const [lastName, setLastName] = useState('')
    const [validLastName, setValidLastName] = useState(false)
    const [lastNameFocus, setLastNameFocus] = useState(false)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)

    const [pwd, setPwd] = useState('')
    const [validPwd, setValidPwd] = useState(false)
    const [pwdFocus, setPwdFocus] = useState(false)

    const [matchPwd, setMatchPwd] = useState('')
    const [validMatch, setValidMatch] = useState(false)
    const [matchFocus, setMatchFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        nameRef.current.focus()
    }, [])

    useEffect(() => {
        setValidFirstName(NAME_REGEX.test(firstName))
    }, [firstName])

    useEffect(() => {
        setValidLastName(NAME_REGEX.test(lastName))
    }, [lastName])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd))
        setValidMatch(pwd === matchPwd)
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('')
    }, [lastName, firstName, email, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // if button enabled with JS hack
        const v1 = NAME_REGEX.test(firstName)
        const v2 = NAME_REGEX.test(lastName)
        const v3 = EMAIL_REGEX.test(email)
        const v4 = PWD_REGEX.test(pwd)
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg('Invalid Entry')
            return
        }
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password: pwd,
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            setSuccess(true)
            setUser('')
            setPwd('')
            setMatchPwd('')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken')
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus()
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <div className="register-container">
                    <section>
                        <p
                            ref={errRef}
                            className={errMsg ? 'errmsg' : 'offscreen'}>
                            {errMsg}
                        </p>
                        <h1>Register</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="firstname">
                                FirstName:
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={
                                        validFirstName ? 'valid' : 'hide'
                                    }
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className={
                                        validFirstName || !firstName
                                            ? 'hide'
                                            : 'invalid'
                                    }
                                />
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                ref={nameRef}
                                autoComplete="off"
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                                required
                                onFocus={() => setFirstNameFocus(true)}
                                onBlur={() => setFirstNameFocus(false)}
                            />
                            <p
                                id="uidnote"
                                className={
                                    firstNameFocus &&
                                    firstName &&
                                    !validFirstName
                                        ? 'instructions'
                                        : 'offscreen'
                                }>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4 to 24 characters.
                                <br />
                                Must be only letters.
                            </p>
                            <label htmlFor="lastname">
                                Last Name:
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={validLastName ? 'valid' : 'hide'}
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className={
                                        validLastName || !lastName
                                            ? 'hide'
                                            : 'invalid'
                                    }
                                />
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                autoComplete="off"
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                                required
                                onFocus={() => setLastNameFocus(true)}
                                onBlur={() => setLastNameFocus(false)}
                            />
                            <p
                                id="uidnote"
                                className={
                                    lastNameFocus && lastName && !validLastName
                                        ? 'instructions'
                                        : 'offscreen'
                                }>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4 to 24 characters.
                                <br />
                                Must be only letters.
                            </p>

                            <label htmlFor="email">
                                Email:
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={validEmail ? 'valid' : 'hide'}
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className={
                                        validEmail || !email
                                            ? 'hide'
                                            : 'invalid'
                                    }
                                />
                            </label>
                            <input
                                type="email"
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            <p
                                id="uidnote"
                                className={
                                    emailFocus && email && !validEmail
                                        ? 'instructions'
                                        : 'offscreen'
                                }>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                The email address you entered is not valid.
                                <br />
                                Please enter a valid email in the format:
                                <br />
                                name@example.com
                            </p>

                            <label htmlFor="password">
                                Password:
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={validPwd ? 'valid' : 'hide'}
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className={
                                        validPwd || !pwd ? 'hide' : 'invalid'
                                    }
                                />
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                            />
                            <p
                                id="pwdnote"
                                className={
                                    pwdFocus && !validPwd
                                        ? 'instructions'
                                        : 'offscreen'
                                }>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                8 to 24 characters.
                                <br />
                                Must include uppercase and lowercase letters, a
                                number and a special character.
                                <br />
                                Allowed special characters:
                                <span>!</span>
                                <span>@</span>
                                <span>#</span>
                                <span>$</span>
                                <span>%</span>
                            </p>
                            <label htmlFor="confirm_pwd">
                                Confirm Password:
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={
                                        validMatch && matchPwd
                                            ? 'valid'
                                            : 'hide'
                                    }
                                />
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className={
                                        validMatch || !matchPwd
                                            ? 'hide'
                                            : 'invalid'
                                    }
                                />
                            </label>
                            <input
                                type="password"
                                id="confirm_pwd"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                            <p
                                id="confirmnote"
                                className={
                                    matchFocus && !validMatch
                                        ? 'instructions'
                                        : 'offscreen'
                                }>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field.
                            </p>
                            <button
                                disabled={
                                    !validFirstName ||
                                    !validLastName ||
                                    !validEmail ||
                                    !validPwd ||
                                    !validMatch
                                        ? true
                                        : false
                                }>
                                Sign Up
                            </button>
                        </form>
                        <p>
                            Already registered?
                            <br />
                            <span className="line">
                                {/*put router link here*/}
                                <a href="#">Sign In</a>
                            </span>
                        </p>
                    </section>
                </div>
            )}
        </>
    )
}

export default Register
