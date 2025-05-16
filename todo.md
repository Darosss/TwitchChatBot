# backend:

models:

- [x] Add timestamps for docs mongoose

- [x] Add separate configs: commands, trigers, timers, loyalty, points, head

- [x] Move common schema fields into separate file

- [x] Overlay and widgets to database (save layouts to DB)

- [x] Add auth encoding

- [x] Move common aggregations to aggregations folder

- [] Add desc to message category

- [] Add delay command

# session:

- [x] Session twitch, messages itd

- [x] Session people

- [x] Session max peek

# general:

- [x] Rename files to camelCase... userService, userRoute, userController

- [x] Remove prefix I for every interface and T for type

- [x] Move options to function to make 'clear' loggers

- [x] Replace app:any to app:Express in router index

- [x] Req.body as interface

- [x] Common interfaces in model

- [] Add tests

# bot handlers:

- [x] Add points for every 5 minutes or sth

- [x] Add r andom messages when no trigger found

- [x] Add send random message only from enabled category and tags / moods

- [x] Add send trigger only from enabled trigers and tags / moods

- [x] Add send commands only from enabled trigers and tags / moods

- [x] Add send timers only from enabled trigers and tags / moods

- [x] Music stream player to overlay?

- [x] Add custom rewards by api

- [x] Remove cusomt rewards by api

- [x] Edit custom reward by api

- [x] Get list of custom rewards

- [x] Add config options to song request

- [x] Add Auth encode

- [x] add volume for music

- [x] add base initial achievements

- [x] add base logic for custom achievements

- [] Add edit enabled and other things to custom alerts sounds

- [] Add format messages

- [] Add Game chat

- [] Add chat commands delay

# timers:

- [x] Add field to timer model sth like: nonFollowMultipler, nonSubMultipler:

- [x] On start bot it starts count timers depends on delays

- [x] If delay fits it send a timer and reset points

- [x] It count points to every timers fro every message

- [x] If points are correct with threshold - reset timer - send message(from some messages
      random) - reset points
- [x] Every message add points depends on multipler(if sub or follow mutlipler > 1) else add 1

- [] Timers follows if need add (get any follow from database and it can be used like
  username, created at followed at itd like in commands handler)

# frontend:

- [x] Add grid events

- [x] Add green color if something is enabled / exist or red if not enabled / not exist

- [x] Refactor from plain css to scss

- [x] Add name when editing grids(session-messages etc)

- [x] Configs setions into spearate file components

- [x] Add home site

- [x] Add dynamical titles

- [x] Replace custom useFetch/useAxios with tanstack query

- [x] Replace useContext's with Redux storage

- [] Box same as messages but with sounds?

- [] Add whole user edit

- [] Add alert when error occurs(utils)
