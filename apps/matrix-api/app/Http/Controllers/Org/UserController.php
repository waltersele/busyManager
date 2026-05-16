<?php

namespace App\Http\Controllers\Org;

use App\Http\Controllers\Controller;
use App\Models\BusinessUserRole;
use App\Models\User;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct(private TenantContext $tenant) {}

    public function index(): JsonResponse
    {
        $users = $this->tenant->organization->members()->get()->map(fn ($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->pivot->role,
        ]);

        return response()->json(['data' => $users]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:org_admin',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $this->tenant->organization->members()->attach($user->id, ['role' => $data['role']]);

        return response()->json(['id' => $user->id, 'email' => $user->email], 201);
    }

    public function assignBusinessRole(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'business_id' => 'required|exists:businesses,id',
            'role' => 'required|in:manager,agent,viewer',
        ]);

        BusinessUserRole::updateOrCreate(
            ['business_id' => $data['business_id'], 'user_id' => $data['user_id']],
            ['role' => $data['role']],
        );

        return response()->json(['message' => 'Role assigned']);
    }
}
