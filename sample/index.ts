import { LottoRouter } from '../src'

const users = [
    {
        id: 1,
        name: 'Mario',
        surname: 'Rossi',
    },
    {
        id: 2,
        name: 'Max',
        surname: 'Mustermann',
    },
    {
        id: 3,
        name: 'Jane',
        surname: 'Doe',
    },
    {
        id: 4,
        name: 'Pera',
        surname: 'Perić',
    },
]

const profiles = [
    { id: 1, userId: 1, sex: 'male', nationality: 'Italian' },
    { id: 2, userId: 2, sex: 'male', nationality: 'Austrian' },
    { id: 3, userId: 3, sex: 'female', nationality: 'American' },
    { id: 4, userId: 4, sex: 'female', nationality: 'Serbian' },
]

const lottoJS = new LottoRouter({
    host: '0.0.0.0',
    port: 9004,
    prefix: '/api',
})

// Auth middleware
lottoJS.use(({ req, res, next }) => {
    if (req.headers.authorization !== '1234') {
        return res.status(401).json({
            message: 'unauthorized.',
        })
    }

    next()
})

lottoJS.get('/', ({ res }) => {
    return res.status(200).text('welcome!')
})

lottoJS.get('users', ({ req, res }) => {
    const { name } = req.query

    if (!name) return res.status(200).json(users)

    const searchUsers = users.filter((user) => user.name === name)

    if (!searchUsers) {
        return res.status(404).json({
            message: 'user not found.',
        })
    }

    return res.status(200).json(searchUsers)
})

lottoJS.get('users/:id', ({ req, res }) => {
    const userId = Number(req.param('id'))
    const showFullInfo = req.get('full')

    const user = users.find((user) => user.id === userId)

    if (!user) {
        return res.status(404).json({
            message: 'user not found.',
        })
    }

    if (!showFullInfo) return res.status(200).json(user)

    const profile = profiles.find((profile) => profile.userId === userId)

    return res.status(200).json({
        ...user,
        ...(profile
            ? {
                  profile: {
                      sex: profile.sex,
                      nationality: profile.nationality,
                  },
              }
            : {}),
    })
})

lottoJS.put('users/:id', ({ req, res }) => {
    const { id } = req.params
    const body = req.body

    const user = users.find((user) => user.id === Number(id))

    if (!user) {
        return res.status(404).json({
            message: 'user not found.',
        })
    }

    const profile = profiles.find((profile) => profile.userId === Number(id))

    if (!profile)
        return res.status(404).json({
            message: 'profile not found.',
        })

    user.name = body.name
    user.surname = body.name
    profile.sex = body.profile.sex
    profile.nationality = body.profile.nationality

    return res.status(201).json({
        ...user,
        ...profile,
    })
})

lottoJS.init()
