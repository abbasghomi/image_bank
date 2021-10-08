create table public.classes
(
    id   serial not null,
    name varchar(100)
);

create unique index classes_id_uindex
    on public.classes (id);

create table public.labels
(
    id   serial not null,
    name varchar(100)
);

create unique index labels_id_uindex
    on public.labels (id);

create table public.users
(
    id       serial not null,
    username varchar(100),
    name     varchar(100),
    family   varchar(100),
    password text,
    email    varchar(255)
);

create unique index users_id_uindex
    on public.users (id);

create unique index users_email_uindex
    on public.users (email);

create table public.images
(
    id        serial not null,
    thumbnail text,
    filename  varchar(255),
    user_id   integer
);

create unique index images_id_uindex
    on public.images (id);

create table public.layers
(
    id        serial not null,
    class_id  integer
        constraint layers_classes_id_fk
            references public.classes (id),
    label_id  integer
        constraint layers_labels_id_fk
            references public.labels (id),
    x         integer,
    y         integer,
    width     integer,
    height    integer,
    image_id  integer
        constraint layers_images_id_fk
            references public.images (id),
    user_id   integer,
    thumbnail text
);

create unique index layers_id_uindex
    on public.layers (id);

