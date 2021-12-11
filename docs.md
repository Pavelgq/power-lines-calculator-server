## Power Lines Calculators API

# Routes

- User
- [Administrator](#admin)
- Accept
- Action

<a name="admin"><h2>Administrator</h2></a>

### Создает нового администратора

#### Request

`POST /api/v1/admin/create`

```json
{
  "login": "",
  "password": "",
  "status": ""
}
```

#### Response

```json
{
  "token": "JWT...",
  "message": "Пользователь успешно зарегистрирован"
}
```

- В заголовках необходимо передать jwt token: `token: JWT......`
- Зарегистрировать администратора может только пользователь с правами администратора

### Авторизация администратора

#### Request

`POST /api/v1/admin/login`

```json
{
  "login": "",
  "password": ""
}
```

#### Response

```json
{
  "id": "",
  "status": "",
  "user": "",
  "token": "JWT + token"
}
```

### Получить данные администратора по id

#### Request

`GET /api/v1/admin/:id`

#### Response

```json
{
  "login": "",
  "password": "",
  "status": ""
}
```

### Изменить данные администратора по id

#### Request

`PUT /api/v1/admin/:id`

```json
{
  "login": "",
  "status": ""
}
```

#### Response

```json
{
  "message": "Пользователь успешно изменен"
}
```

### Удалить администратора по id

#### Request

`DELETE /api/v1/admin/:id`

#### Response

```json
{
  "message": "Пользователь успешно удален"
}
```
