<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\AreaRoleUser;
use App\Models\Area;
use App\Models\Role;
use App\Models\SshSession;

class User extends Authenticatable
{


    public function areaRoles()
    {
        return $this->hasMany(AreaRoleUser::class);
    }
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'roles');
    }
    // Áreas a las que pertenece el usuario
    public function areas(): BelongsToMany
    {
        return $this->belongsToMany(Area::class);
    }
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function sshSessions(): HasMany
    {
        return $this->hasMany(SshSession::class);
    }
}
