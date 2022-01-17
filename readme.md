## Power Lines Calculators API

# Routes

- [Administrator](#admin)
- [Client](#client)
- [Accept](#accept)
- [Action](#action)

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
  "login": "",
  "token": "JWT + token"
}
```

### Проверка авторизации по токену

#### Request

`GET /api/v1/admin/profile`

- В заголовках необходимо передать jwt token: `token: JWT......`

#### Response

Возвращает код 200, если токен актуален и сообщение об ошибке в противном случае

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

<a name="client"><h2>Client</h2></a>

### Добавление нового клиента

#### Request

`POST /api/v1/client/create`

```json
{
  "first_name": "",
  "last_name": "",
  "company": "",
  "office_position": "",
  "phone_number": "",
  "email": ""
}
```

#### Response

```json
{
  "message": "Пользователь успешно cоздан"
}
```

- В заголовках необходимо передать jwt token: `token: JWT......`

### Получить данные всех клиентов

#### Request

`GET /api/v1/client/all`

#### Response

```json
[
  {
    "first_name": "",
    "last_name": "",
    "company": "",
    "office_position": "",
    "phone_number": "",
    "email": "",
    "client_key": "",
    "valid_untill: "",
  },
  ...
]
```

### Получить данные клиента по id

#### Request

`GET /api/v1/user/:id`

#### Response

```json
{
  "first_name": "",
  "last_name": "",
  "company": "",
  "office_position": "",
  "phone_number": "",
  "email": ""
}
```

### Изменить данные клиента по id

#### Request

`PUT /api/v1/user/:id`

```json
{
  "first_name": "",
  "last_name": "",
  "company": "",
  "office_position": "",
  "phone_number": "",
  "email": ""
}
```

#### Response

```json
{
  "message": "Данные пользователя изменены успешно"
}
```

### Удаление клиента по id

#### Request

`DELETE /api/v1/user/:id`

#### Response

```json
{
  "message": "Пользователь успешно удален"
}
```

<a name="accept"><h2>Accept</h2></a>

### Проверка ключа

#### Request

`GET /api/v1/accept/check/:key`

#### Response

```json
{
  "acceptToken": "..."
}
```

- Полученный `acceptToken` необходим для доступа к путям `/action`

### Создание ключа для клиента

#### Request

`POST /api/v1/accept/:id`

```json
{
  "validDate": "10-10-2021"
}
```

#### Response

```json
{
  "key": "...",
  "message": "Новый ключ для клиента добавлен в базу"
}
```

### Получение ключа по id клиента

#### Request

`GET /api/v1/accept/:id`

#### Response

```json
{
  "key:": "..."
}
```

### Изменение ключа по id клиента

#### Request

`PUT /api/v1/accept/:id`

```json
{
  "validDate": "10-10-2021"
}
```

#### Response

```json
{
  "message": "Ключ успешно изменен"
}
```

### Удаление ключа по id клиента

#### Request

`DELETE /api/v1/accept/:id`

#### Response

```json
{
  "message": "Ключ успешно удален"
}
```

<a name="action"><h2>Action</h2></a>

### Сохранение действий клиента

#### Request

`POST /api/v1/action/add`

```json
{
  "client_id": "",
  "type": "calculation | save | load",
  "data": {},
  "project_name": ""
}
```

#### Response

```json
{
  "data": {
    "id": "",
    "client_id": "",
    "type": "",
    "date": "",
    "path_of_data": "",
    "accept_key": "",
    "project_name": ""
  }
  "message": "Действие пользователя сохранено"
}
```

- Необходимо иметь `acceptToken`, который появляется после успешной проверки ключа

### Получение списка всех действий

#### Request

`GET /api/v1/action/all?page=1&limit=5`

#### Response

```json
[
  {
    "id": "",
    "client_id": "",
    "type": "",
    "date": "",
    "path_of_data": "",
    "accept_key": "",
    "project_name": ""
  },
  {
    "id": "",
    "client_id": "",
    "type": "",
    "date": "",
    "path_of_data": "",
    "accept_key": "",
    "project_name": ""
  }
]
```

### Получение списка сохраненных расчетов клиента по id

#### Request

`GET /api/v1/action/:id?page=1&limit=5`

#### Response

```json
{
  "id": "",
  "client_id": "",
  "type": "calculation | save | load",
  "data": {},
  "accept_key": "",
  "project_name": ""
}
```

- Необходимо иметь `acceptToken`, который появляется после успешной проверки ключа

### Получение файла сохраненных расчетов по имени

#### Request

`GET /api/v1/action/file/1-1639245209200.json`

#### Response

`1-1639245209200.json`
